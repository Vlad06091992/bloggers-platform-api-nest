Версия ноды, на которой работает приложение: 20.9.0

Работа с миграциями:

1) cоздание миграций:
   npm run migration:generate ./src/migrations/init-migration
   init-migration - это имя миграции
2) накатывание всех созданных миграций
   npm run migration:apply
3) Откат последней миграции
   npm run migration:revert

