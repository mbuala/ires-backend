// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  name: 'default',
  version: 'v1.0',
  backendServer: 'http://localhost:3000/api/ires/',
   //prod
   url : '../dist/assets/img/angular2-logo-red.png'
   // ng serve
   // url : 'assets/img/angular2-logo-red.png'
};
