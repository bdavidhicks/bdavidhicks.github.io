---
layout: post
title: "Updates Site"
date: 2018-04-15
author:
  name: Brian Hicks
  email: brian.david.hicks@gmail.com
tags: jekyll ruby gem blog
---
# Updating the Site

Today I spent quite some time just making the theme work for Jekyll and being able to build the project locally to make sure that all the links work. Learned a lot about Ruby and Gem files and bundle too.

Here are the steps that I had to take.

1.  <pre><code class="bash">sudo apt-get install ruby-full rubygems && sudo apt-get update</code></pre>
2.  <pre><code class="bash">sudo gem install jekyll bundler</code></pre>
    *   Then from [here](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers) I found this command because the command in step 4 was failing...
3.  <pre><code class="bash">echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p</code></pre>
4.  <pre><code class="bash">bundle exec jekyll serve
...
Server address: http://127.0.0.1:4000
Server running... press ctrl-c to stop.</code></pre>

This is necessary because I am using a Github Pages Theme called "Hacker" for basic styling and layout.
