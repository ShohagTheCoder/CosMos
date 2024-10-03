import { Test, TestingModule } from '@nestjs/testing';
import { ClearController } from './clear.controller';
import { ClearService } from './clear.service';

describe('ClearController', () => {
    let controller: ClearController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClearController],
            providers: [ClearService],
        }).compile();

        controller = module.get<ClearController>(ClearController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
