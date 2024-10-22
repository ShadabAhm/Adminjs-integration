import { Module, OnModuleInit } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import * as AdminJSMikroORM from '@adminjs/mikroorm';
import AdminJS from 'adminjs';
import { Employee } from './employee.entity.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';

AdminJS.registerAdapter({
  Resource: AdminJSMikroORM.Resource,
  Database: AdminJSMikroORM.Database,
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    MikroOrmModule.forRoot({
      dbName: 'demodb',
      clientUrl: 'postgres://postgres:admin@localhost:5432/demodb',
      driver: PostgreSqlDriver,
      entities: [Employee],
      debug: true,
      // migrations: {
      //   tableName: 'employees', // Optional: Name of the migrations table
      // },
    }),
    MikroOrmModule.forFeature([Employee]),
    AdminModule.createAdminAsync({
      imports: [MikroOrmModule],
      useFactory: (orm: MikroORM) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            {
              resource: { model: Employee, orm },
              options: {},
            },
          ],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret',
        },
      }),
      inject: [MikroORM],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getSchemaGenerator().updateSchema()
  }
}