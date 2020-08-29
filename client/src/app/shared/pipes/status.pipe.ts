import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatStatus'
})
export class FormatStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 400:
        return '400 - Bad Request';
      case 401:
        return '401 - Unauthorized';
      case 403:
        return '403 - Forbidden';
      case 500:
        return '500 - Internal Server Error';
      case 504:
        return '504 - Gateway Timeout';
      case 404:
      default:
        return '404 - Not Found';
    }
  }
}
