export type BirthDateInputProps = {
    day: string;
    month: string;
    year: string;
    onChangeDay: (day: string) => void;
    onChangeMonth: (month: string) => void;
    onChangeYear: (year: string) => void;
    error?: boolean;
};

export type BirthPlaceInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSearchPress: () => void;
    error?: boolean;
};

export type PlaceApiResponse = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
};

export type PlaceOption = {
    label: string;
    value: string,
    latitude: string;
    longitude: string
};

export type BirthTimeInputProps = {
    hour: string;
    minute: string;
    onChangeHour: (hour: string) => void;
    onChangeMinute: (minute: string) => void;
    error?: boolean;
};

export type ChartData = Record<number, { rashi: string; planets: string[] }>;

export type DrawChartProps = {
    chartData: ChartData;
};

export type GenderSwitchProps = {
    isFemale: string;
    onValueChange: (isFemale: string) => void;
};


export type NameInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    error?: boolean;
};

export interface SelectDialogProps {
    visible: boolean;
    title: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    loading?: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
}
