import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, IconButton, HelperText } from 'react-native-paper';
import SelectDialog from './SelectDialog';
import HttpService from '../services/httpService';
import { birthPlaceInputStyles as styles } from '../custom-styles/birthPlaceInputStyles';
import { BirthPlaceInputProps, PlaceOption, TimezoneOption } from '../utils/componentTypes';

const nominatimService = new HttpService(process.env.EXPO_PUBLIC_APP_BASE_URL);

const BirthPlaceInput = ({
  value,
  onChangeText,
  onSearchPress,
  error,
  latitude,
  longitude,
  timeZone,
  onChangeLatitude,
  onChangeLongitude,
  onChangeTimeZone,
}: BirthPlaceInputProps) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeOptions, setPlaceOptions] = useState<PlaceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);

  const fetchTimezone = async (lat: string, lon: string) => {
    try {
      const response = await nominatimService.get<TimezoneOption>('/timezone/search', {
        latitude: lat,
        longitude: lon,
      });
      if (response.ok) {
        console.log('Fetched timezone:', response.data);
        onChangeTimeZone(response.data.utcOffset);
      } else {
        console.log('Timezone API error, status:', response.status, response.data);
      }
    } catch (error) {
      console.log('Error fetching timezone:', error);
    }
  };

  const handleSearchPress = async () => {
    onSearchPress();

    if (value.trim() === '') {
      setQueryError(true);
      return;
    }
    setQueryError(false);
    setPlaceOptions([]);
    setLoading(true);
    setModalVisible(true);

    const params: Record<string, string> = {
      q: value.trim(),
      limit: String(5),
      addressdetails: String(1),
      format: 'json',
    };

    const headers = {
      'User-Agent': 'JyotishApp/1.0 (mobile-app)',
    };

    try {
      const response = await nominatimService.get<PlaceOption[]>('/geolocation/search', params, headers);
      if (response.ok) {
        console.log('Fetched places:', response.data);
        setPlaceOptions(response.data);

      } else {
        console.log('Place API error, status:', response.status, response.data);
      }
    } catch (error) {
      console.log('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Birth Place *</Text>
      <View style={styles.row}>
        <TextInput
          label="Birth Place"
          mode="flat"
          error={error || queryError}
          style={[styles.input, styles.textField]}
          placeholderTextColor="#999"
          onChangeText={(text) => {
            setQueryError(false);
            onChangeText(text);
          }}
          value={value}
        />
        <IconButton
          icon="magnify"
          mode="contained"
          style={styles.searchButton}
          onPress={handleSearchPress}
        />


      </View>
      <View style={styles.coordRow}>
        <TextInput
          label="Latitude"
          mode="flat"
          placeholder="Latitude"
          value={latitude}
          onChangeText={onChangeLatitude}
          style={[styles.smallinput, styles.coordField]}
          placeholderTextColor="#999"
        />
        <TextInput
          label="Longitude"
          mode="flat"
          placeholder="Longitude"
          value={longitude}
          onChangeText={onChangeLongitude}
          style={[styles.smallinput, styles.coordField]}
          placeholderTextColor="#999"
        />

      </View>
      <Text style={styles.timezoneLabel}>Time Zone : {timeZone}</Text>



      <HelperText type="error" visible={!!error}>
        Birth place is required
      </HelperText>
      <HelperText type="error" visible={queryError}>
        Please type a place name before searching
      </HelperText>
      <SelectDialog
        visible={modalVisible}
        title="Choose Place"
        options={placeOptions}
        selectedValue={selectedPlace}
        loading={loading}
        onClose={() => setModalVisible(false)}
        onSelect={(value: any) => {
          const place = placeOptions.find((p) => p.value === value);
          setSelectedPlace(value);
          onChangeLatitude(place?.latitude || '');
          onChangeLongitude(place?.longitude || '');
          onChangeText(place?.label ?? value);

          if (place?.latitude && place?.longitude) {
            fetchTimezone(place.latitude, place.longitude);
          }
        }}
      />
    </View>
  );
};


export default BirthPlaceInput;
