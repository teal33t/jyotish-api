package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const timeAPIBaseURL = "https://timeapi.io/api"
const timezoneCacheTTL = 24 * time.Hour

type timeAPITimezoneResponse struct {
	TimeZone         string `json:"timeZone"`
	CurrentUtcOffset struct {
		Seconds int `json:"seconds"`
	} `json:"currentUtcOffset"`
}

// TimezoneOption is the normalized shape returned by SearchTimezone.
type TimezoneOption struct {
	TimeZone  string `json:"timeZone"`
	UtcOffset string `json:"utcOffset"`
}

// SearchTimezone godoc
// @Summary      Look up timezone by coordinates
// @Description  Proxy to timeapi.io TimeZone/coordinate API, normalized to {timeZone, utcOffset}
// @Tags         geolocation
// @Accept       json
// @Produce      json
// @Param        latitude   query     number  true  "Latitude"
// @Param        longitude  query     number  true  "Longitude"
// @Success      200        {object}  TimezoneOption
// @Failure      400        {object}  map[string]interface{}
// @Failure      502        {object}  map[string]interface{}
// @Router       /timezone/search [get]
func (h *Handler) SearchTimezone(c *gin.Context) {
	lat := c.Query("latitude")
	lon := c.Query("longitude")
	if lat == "" || lon == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Query parameters 'latitude' and 'longitude' are required",
		})
		return
	}

	if _, err := strconv.ParseFloat(lat, 64); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Query parameter 'latitude' must be a number",
		})
		return
	}

	if _, err := strconv.ParseFloat(lon, 64); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "validation_error",
			"message": "Query parameter 'longitude' must be a number",
		})
		return
	}

	params := url.Values{}
	params.Set("latitude", lat)
	params.Set("longitude", lon)

	cacheKey := "timezone:search:" + params.Encode()

	ctx := c.Request.Context()
	if cached, err := h.redis.Get(ctx, cacheKey).Bytes(); err == nil {
		c.Header("Content-Type", "application/json")
		c.Header("X-Cache", "HIT")
		c.Data(http.StatusOK, "application/json", cached)
		return
	}

	targetURL := timeAPIBaseURL + "/TimeZone/coordinate?" + params.Encode()

	req, err := http.NewRequest(http.MethodGet, targetURL, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "request_error",
			"message": "Failed to create request: " + err.Error(),
		})
		return
	}

	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: http.DefaultClient.Timeout}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to fetch from TimeAPI: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to read TimeAPI response: " + err.Error(),
		})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.Header("Content-Type", "application/json")
		c.Header("X-Cache", "MISS")
		c.Data(resp.StatusCode, "application/json", body)
		return
	}

	var raw timeAPITimezoneResponse
	if err := json.Unmarshal(body, &raw); err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "Failed to parse TimeAPI response: " + err.Error(),
		})
		return
	}

	if raw.TimeZone == "" {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "upstream_error",
			"message": "TimeAPI response missing timeZone",
		})
		return
	}

	offsetHours := float64(raw.CurrentUtcOffset.Seconds) / 3600.0

	sign := "+"
	if offsetHours < 0 {
		sign = "-"
	}

	timezone := TimezoneOption{
		TimeZone:  raw.TimeZone,
		UtcOffset: fmt.Sprintf("%s%05.2f", sign, math.Abs(offsetHours)),
	}

	respBody, err := json.Marshal(timezone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "encoding_error",
			"message": "Failed to encode response: " + err.Error(),
		})
		return
	}

	cacheCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	h.redis.Set(cacheCtx, cacheKey, respBody, timezoneCacheTTL)

	c.Header("Content-Type", "application/json")
	c.Header("X-Cache", "MISS")
	c.Data(http.StatusOK, "application/json", respBody)
}
