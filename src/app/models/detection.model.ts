export default class Detection {
  detectionId: string;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  detectionType: string;
  associations: string[];
  tags: string[];
  classifications: string[];
  color: string;
}
