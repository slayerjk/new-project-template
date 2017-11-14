To install all node modules:
1.install nodejs(for npm);
2.npm i -g gulp-cli//Gulp global install;
2.install git//for bower;
      2.1.git config --global credential.helper wincred - for use git without password prompt on local machine.;
3.npm i -g bower//install bower global(for libs);
      3.1 "bowerrc" file in project root:
          {
           "directory": "app/libs"
           }
      3.2 installing with bower(in project dir):
          $ bower install <package>//https://bower.io/search/
4.npm init/npm -i//for new installation (without package.json) do in project dir;
5.npm install//install all modules that are exist in "package.json".
6.for correct work with php - type nes site in hosts-file(ex.:127.0.0.1 mysite), normally OSPanel do it it itself, if has rights.