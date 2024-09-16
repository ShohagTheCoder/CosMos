import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
    const app = await NestFactory.create(SeederModule);
    const seeder = app.get(SeederService);

    try {
        await seeder.seed();
    } catch (error) {
        console.error('Seeding failed', error);
    }

    await app.close(); // Close the app after seeding
}

bootstrap();
