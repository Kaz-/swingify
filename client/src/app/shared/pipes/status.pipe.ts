import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatStatus'
})
export class FormatStatusPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case '404':
      default:
        return '404 - Not Found';
    }
  }
}
