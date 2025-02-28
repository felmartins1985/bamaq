import { INestApplication, ValidationPipe } from '@nestjs/common';

export default (app: INestApplication) => {
  console.log('Configurando o app...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // levantar erro quando a chave não existir
      transform: false, // tenta transformar os tipos de dados de param e dtos
    }),
  );
  return app;
};
