import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'deepFilter',
  pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   *
   */
  static filter(items: Array<{ [key: string]: any }>, term: string, columnsToExclude?: Array<string>): Array<{ [key: string]: any }> {

    const toCompare = term.toLowerCase();

    function checkInside(item: any, searchTerm: string) {
      for (const property in item) {
         if (columnsToExclude.some(x => x === property)) {
          continue;
        } else {
          if (item[property] === null || item[property] === undefined) {
            continue;
          }
          if (typeof item[property] === 'object') {
            if (checkInside(item[property], searchTerm)) {
              return true;
            }
          }
          if (item[property].toString().toLowerCase().includes(toCompare)) {
            return true;
          }
        }
      }
      return false;
    }

    return items.filter(function (item) {
      return checkInside(item, term);
    });
  }

  /**
   * @param items object from array
   * @param term term's search
   */
  transform(items: any, term: string, props?: Array<string>): any {
    if (!term || !items) {
        return items;
    }
    return SearchPipe.filter(items, term, props);
  }
}
