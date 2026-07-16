package model

import "time"

type KundaliSave struct {
	ID        uint      `json:"id" bson:"_id"`
	UserID    uint      `json:"user_id" bson:"user_id"`
	File      string    `json:"file" bson:"file"`
	Data      string    `json:"data" bson:"data"`
	CreatedAt time.Time `json:"created_at" bson:"created_at"`
}

type Kundli struct {
	Chart               ChartData  `json:"chart"`
	DurationOfResponse  float64    `json:"duration_of_response"`
	CreatedAt           string     `json:"created_at"`
}

type ChartData struct {
	User    UserData              `json:"user"`
	Graha   GrahaData             `json:"graha"`
	Bhava   map[string]BhavaData `json:"bhava"`
	Lagna   LagnaData             `json:"lagna"`
	Panchanga PanchangaData      `json:"panchanga"`
	Rising  RisingData            `json:"rising"`
	Kala    KalaData              `json:"kala"`
	Dasha   DashaData             `json:"dasha"`
}

type UserData struct {
	DateTime  string  `json:"datetime"`
	Timezone  string  `json:"timezone"`
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
	Altitude  float64 `json:"altitude"`
}

type GrahaData map[string]GrahaEntry

type GrahaEntry struct {
	Longitude    float64           `json:"longitude"`
	Latitude     float64           `json:"latitude"`
	Speed        float64           `json:"speed"`
	Ascension    float64           `json:"ascension"`
	Declination  float64           `json:"declination"`
	Rashi        int               `json:"rashi"`
	Degree       float64           `json:"degree"`
	Nakshatra    NakshatraData     `json:"nakshatra"`
	Astangata    *bool             `json:"astangata"`
	RashiAvastha string            `json:"rashiAvastha"`
	Vargottama   bool              `json:"vargottama"`
	Yuddha       *bool             `json:"yuddha"`
	Gocharastha  int               `json:"gocharastha"`
	BhavaCharacter string          `json:"bhavaCharacter"`
	TempRelation map[string]int    `json:"tempRelation"`
	Relation     map[string]*int   `json:"relation"`
	Yogakaraka   bool              `json:"yogakaraka"`
	Mrityu       bool              `json:"mrityu"`
	PushkaraNavamsha int           `json:"pushkaraNavamsha"`
	PushkaraBhaga float64          `json:"pushkaraBhaga"`
	Avastha      AvasthaData       `json:"avastha"`
	Dispositor   string            `json:"dispositor"`
}

type NakshatraData struct {
	Anga   string  `json:"anga"`
	Key    int     `json:"key"`
	Ratio  int     `json:"ratio"`
	Abhijit bool   `json:"abhijit"`
	Left   float64 `json:"left"`
	Name   string  `json:"name"`
	Pada   int     `json:"pada"`
}

type AvasthaData struct {
	Baladi    string   `json:"baladi"`
	Jagradi   string   `json:"jagradi"`
	Deeptadi  []string `json:"deeptadi"`
}

type BhavaData struct {
	Graha map[string]GrahaEntry `json:"graha"`
}

type LagnaData struct {
	Lg  GrahaEntry `json:"Lg"`
	MLg GrahaEntry `json:"MLg"`
}

type PanchangaData struct {
	Tithi    TithiData    `json:"tithi"`
	Nakshatra NakshatraData `json:"nakshatra"`
	Yoga     YogaData     `json:"yoga"`
	Vara     VaraData     `json:"vara"`
	Karana   KaranaData   `json:"karana"`
}

type TithiData struct {
	Anga    string  `json:"anga"`
	Key     int     `json:"key"`
	Name    string  `json:"name"`
	Paksha  string  `json:"paksha"`
	Left    float64 `json:"left"`
}

type YogaData struct {
	Anga string  `json:"anga"`
	Key  int     `json:"key"`
	Name string  `json:"name"`
	Left float64 `json:"left"`
}

type VaraData struct {
	Anga  string `json:"anga"`
	Key   string `json:"key"`
	Week  string `json:"week"`
	Name  string `json:"name"`
	Left  float64 `json:"left"`
}

type KaranaData struct {
	Anga string  `json:"anga"`
	Key  int     `json:"key"`
	Name string  `json:"name"`
	Left float64 `json:"left"`
}

type RisingData map[string][]RisingEntry

type RisingEntry struct {
	Rising string `json:"rising"`
	Setting string `json:"setting"`
}

type KalaData struct {
	Hora HoraData `json:"hora"`
}

type HoraData struct {
	Number   int     `json:"number"`
	Key      string  `json:"key"`
	Interval float64 `json:"interval"`
	Left     float64 `json:"left"`
	Type     string  `json:"type"`
	End      string  `json:"end"`
}

type DashaData struct {
	Nesting  int                `json:"nesting"`
	Type     string             `json:"type"`
	Key      string             `json:"key"`
	Duration int64              `json:"duration"`
	Start    string             `json:"start"`
	End      string             `json:"end"`
	Periods  map[string]DashaPeriod `json:"periods"`
}

type DashaPeriod struct {
	Nesting  int    `json:"nesting"`
	Type     string `json:"type"`
	Key      string `json:"key"`
	Duration int64  `json:"duration"`
	Start    string `json:"start"`
	End      string `json:"end"`
}
