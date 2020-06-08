import { AnnotationType } from '../aisle-view/annotation-type';

export default class Annotation {
    annotationType: AnnotationType;
    annotationCategory: string;
    labelId: string;
    top: number;
    left: number;
    color: string;
    out: boolean;
}
