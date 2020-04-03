export default class Detection {
  detectionId: number;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  detectionType: string;
  associations: number[];
  tags: string[];
  classifications: string[];
  color: string;
}
