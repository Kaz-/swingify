import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatError'
})
export class FormatErrorPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 400:
        return 'Whoops, the server could not understand your request!';
      case 401:
        return 'You must be logged in to see this!';
      case 403:
        return 'You are not allowed to see this!';
      case 500:
      case 504:
        return 'There was an unexpected error. Try again and feel free to contact us if the problem persists!';
      case 404:
      default:
        return 'Whoops, there is nothing here!';
    }
  }
}
