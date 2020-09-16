import { Controller } from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';

@Controller('extractor')
export class ExtractorController {
    constructor(
        private readonly memory_service: MemoryService
    ) { }


}