import { Module } from '@nestjs/common';
import { MemoryService } from '../memory/memory.service';
import { ExtractorController } from './extractor.controller';

@Module({
    providers: [MemoryService],
    controllers: [ExtractorController]
})
export class ExtractorModule { }