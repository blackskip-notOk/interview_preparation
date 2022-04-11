# **GIT Alias**

The alias config in Git works like this.
git config --global alias.[new_alias] "[previous_git_command]"

## **git recommit**

```` git
git config --global alias.recommit 'commit --amend -m'
````

`git commit --amend` allows you to change the last commit message. recommit is simpler and much easier to remmember.

**Change the last commit message with recommit:** `git recommit "New commit message"`
***

## **git commend**

```` git
git config --global alias.commend 'commit --amend --no-edit'
````

Commit amend with `--no-edit` flag allows you to commit the new changes in repo with the last commit made, so you don't have to repeat the commit messages again.
***

## **git search**

```` git
git config --global alias.search 'grep'
````

`git search [search_term]`

git grep allows you to search in the repository for a keyword and it returns the various matches. It is cool, but I don't know what grep means, please tell me if you do. I prefer search instead, easy to remmember and easy to use.
***

## **git here**

```` git
git config --global alias.here '!git init && git add . && git commit -m "init 🦄"'
````

Usually when I initialize a new repo, I'll stage all the files and I'll commit with an initial commit message. git here does it all in one step. Just run it in the folder you want to make a new repo and you are good to go.
***

## **git who**

```` git
git config --global alias.who 'blame'
````

`git who index.ts`

git blame is used to examine the contents of a file line by line and see when each line was last modified and who the author of the modifications was. If there was a bug, in a line, you find who who did it and blame them.
***

## **git zip**

```` git
git config --global alias.zip 'archive --format=tar.gz -o ../repo.tar.gz'
````

`git zip [branch_name]`

The archive commands allows you to create tarballs and zips of your whole repo or some. git zip will make it easy to remmember. Just add the branch name.
***

## **git newbie**

```` git
git config --global alias.newbie 'checkout --orphan'
````

`git newbie [new_branch_name]`

`git checkout` with the `--orphan` flag allows you to create a branch without any history from the parent branch. No commit, fresh out of the box branch.
***

## **git clonely**

```` git
git config --global alias.clonely 'clone --single-branch --branch'
````

`git clonely [branch_name] [remote_url]`

`git clone` with `--single-branch --branch` flags allows you to clone a specific branch from a repo and I can say.
***

## **git plg**

```` git
git config --global alias.plg "log --graph --pretty=format:'%C(yellow)%h%Creset -%Cred%d%Creset %s %Cgreen| %cr %C(bold blue)| %an%Creset' --abbrev-commit --date=relative"
````

`git plg`

There is nothing wrong with git log except that it is a little ugly, no color differences and if you want to customize it, you'll have to do some amount of googling. Fortunately, we have aliasing. Alias the command and you'll get a very pretty log of everything.
***

## **git fresh**

```` git
git config --global alias.fresh "filter-branch --prune-empty --subdirectory-filter"
````

`git fresh [subfolder] [branch_name]`

`git fresh src main`

Don't do this unless you know what you are doing
The series of commands that fresh replace is used to create a new repository out of the contents of a subfolder. filter-branch with it many flags take a the contents of a specified subfolder and replaces the content in the while repo with the content of the subfolder.
