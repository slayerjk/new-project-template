To install all node modules:
1.install nodejs(for npm);
2.npm i -g gulp-cli//Gulp global install;
2.install git//for bower;
3.npm i -g bower//install bower global(for libs);
      3.1 "bowerrc" file in project root:
          {
           "directory": "app/libs"
           }
      3.2 installing with bower(in project dir):
          $ bower install <package>//https://bower.io/search/
4.npm init/npm -i//in project dir;
5.npm install//install all modules in "package.json"(if it exists).