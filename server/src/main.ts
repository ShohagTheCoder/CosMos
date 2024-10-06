import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for requests from the Next.js client
    app.enableCors({
        origin: 'http://localhost:3000', // Allow requests from this origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    });

    // Use the custom exception filter globally
    app.useGlobalFilters(new HttpExceptionFilter());

    // Start the server and listen on port 3001
    await app.listen(3001);
}
bootstrap();
