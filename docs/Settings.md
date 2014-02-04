#Settings 

Splendid has a well integrated settings system allowing users to sync their settings acrossed all their computers. This gives developers the ability to register their settings for their Plugins and forget about all the hassle of keeping things in sync.

#Registering a Setting

Registering settings is super easy simply inject the `Settings` Service and then call the `register`
method this takes two arguments `category` and `settings` 

* `category`: is a string defining the top level setting navigation.
* `settings`: is an array of setting definitions. review 

