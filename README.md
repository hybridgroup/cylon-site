## Cylon Website

This is the code for the website for Cylon (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js.
If you are looking for the actual Cylon code itself, it is at https://github.com/hybridgroup/cylon

This site is build using [Middleman](http://middlemanapp.com/basics/getting-started/)

To run locally:

      bundle install
      bundle exec middleman

### Documentation

This project uses HAML.

If you want to help us with the documentation of the site, you can follow this steps :

- 1) Download the zip of the branch "master" or clone the project with git.

      git clone git@github.com:hybridgroup/cylon-site.git "name"

- 2) Create a new branch for the project and switch to that new branch.

      git branch "new_name"
      git checkout "new_name"

  or

      git checkout -b "new_name"

- 3) Open the project with your favourite text editor.

- 4) Go to the file `source/documentation` , here is all the documentation of the site.

#### Platforms

To update the introduction information of a platform:

- 1) Go to the file `source/documentation/platforms` , and select the platform you want to edit.

All of the content beginning with `How to Install` is generated from the platform's github repo. To add new documentation to any platform, edit the readme in the respective Cylon module's repository.

In order for the readme to be properly extracted, the content being pushed to the site must:

- begin with `## How to Install` and end with `## Documentation`
- have a new line after each code block

To import platforms from the main Cylon repository, run the `bin/import-platforms` script. You'll need to have Git installed.

This script will:

- clone down the Cylon repos
- extract all platform readmes
- convert github markdown syntax to be haml compatible
- save the platform documentation to `source/documentation/platforms/partials`

#### Drivers

To add new information to any driver, do this :

- 1) Go to the file `source/documentation/drivers` , and select the driver you want to edit.

#### Examples

To import examples from the main Cylon repository, run the `bin/import-examples`
script. You'll need to have Git installed.

This script will:

- clone down the Cylon repos
- extract all examples
- create missing example pages and remove those that have also been removed from the main repo
- create/update examples index page

#### Repo Docs

To import docs partials from Cylon adaptor repositories, run the
`bin/import-docs` script.

This script will:

- clone down Cylon repositories
- extract all inline JSDoc documentation, with the [dox](https://github.com/tj/dox) tool
- add command/event data as partials to `source/documentation/imports/#{repo}`

### Images

To add images for platforms or devices:

- remove entire background
- the image should be 800 width x 600 height
- layer effect: White color overlay with blend mode HUE

Background color is #F3F1EB

### Send your Pull Request

When you have your code ready, create a new PR : `base: master` and `compare:"your_branch"`

### Deploy

[middleman-gh-pages](https://github.com/neo/middleman-gh-pages) gem is being used to build the webpage and deploy to gh-pages branch.

For deploying the webpage, your must be in 'master' branch and run the following command:

      rake publish

You must not have any uncomitted or untracked files in the site dirs, or the publish operation will fail with a message such as `Directory not clean`.

If the publish fails, you might need to remove the `build` dir before trying to run `rake publish` again.
