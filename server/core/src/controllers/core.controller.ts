import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('core')
export class CoreController {

    private logger = new Logger('Core Controller')

    @MessagePattern('receive')
    receivePingFromSpotifyManager(data: string) {
        this.logger.log(`Successfully received ping and data: ${data} !`);
    }

}
