import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatError'
})
export class FormatErrorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case '404':
      default:
        return 'Whoops, there is nothing here!';
    }
  }
}
