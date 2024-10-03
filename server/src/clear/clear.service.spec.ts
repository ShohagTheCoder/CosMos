import { Test, TestingModule } from '@nestjs/testing';
import { ClearService } from './clear.service';

describe('ClearService', () => {
    let service: ClearService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClearService],
        }).compile();

        service = module.get<ClearService>(ClearService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
