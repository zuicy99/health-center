// 위도를 표현하는 타입
type Lat = number;
// 경도를 표현하는 타입
type Lng = number;
// 위도와 경도를 묶어준 타입
export type Coordinates = [Lat, Lng];
// json 에서 온 데이터를 위한 타입정의
export type Info = {
  coordinates: Coordinates;
  //   건강증진센터구분?: string;
  //   운영시작시각?: string;
};
