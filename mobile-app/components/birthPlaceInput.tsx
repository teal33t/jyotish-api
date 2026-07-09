import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, IconButton, HelperText } from 'react-native-paper';
import SelectDialog from './SelectDialog';
import HttpService from '../services/httpService';

type BirthPlaceInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress: () => void;
  error?: boolean;
};

type PlaceApiResponse = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type PlaceOption = { label: string; value: string, latitude: string; longitude: string };

const nominatimService = new HttpService('https://nominatim.openstreetmap.org');

const BirthPlaceInput = ({ value, onChangeText, onSearchPress, error }: BirthPlaceInputProps) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeOptions, setPlaceOptions] = useState<PlaceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

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
      const response = await nominatimService.get<PlaceApiResponse[]>('/search', params, headers);
      if (response.ok) {
        console.log('Fetched places response.data:', response.data);
        const formattedOptions = response.data.map((place) => ({
          label: place.display_name,
          value: String(place.place_id),
          latitude: place.lat,
          longitude: place.lon,
        }));
        console.log('Fetched places:', formattedOptions);
        setPlaceOptions(formattedOptions);

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
          onChangeText={setLatitude}
          style={[styles.input, styles.coordField]}
          placeholderTextColor="#999"
        />
        <TextInput
          label="Longitude"
          mode="flat"
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          style={[styles.input, styles.coordField]}
          placeholderTextColor="#999"
        />

      </View>



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
        onSelect={(value) => {
          const place = placeOptions.find((p) => p.value === value);
          setSelectedPlace(value);
          setLatitude(place?.latitude || '');
          setLongitude(place?.longitude || '');
          onChangeText(place?.label ?? value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textField: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 10,
  },
  coordField: {
    borderStyle: 'dashed',
    fontSize: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

});

export default BirthPlaceInput;
