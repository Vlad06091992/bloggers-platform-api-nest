import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createSwaggerConfig = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Bloggers API')
    .setDescription('The Bloggers API description')
    .setVersion('1.0')
    .addBasicAuth()
    .addTag('Super admin users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  return SwaggerModule.setup('api', app, document);
};
