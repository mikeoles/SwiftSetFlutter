import { AnnotationType } from '../aisle-view/annotation-type';

export default class Annotation {
    annotationType: AnnotationType;
    annotationCategory: string;
    labelId: number;
    bounds: {
        top: number;
        left: number;
        width: number;
        height: number;
      };
    top: number;
    left: number;
    color: string;
}
