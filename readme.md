# BreemMyBash
tools that make your bash terminal bree (the way i like) written in typescript

project is devided into two parts

## bree

all in one program for :
- managing time ("bree plan help")
- todo list ("bree task help")
- calender ("bree cal help")
- converting text (pretty useless "bree encode [text]")
- playing ringtone (to announce command completion intended to use "[commad]&&bree done",requires paplay)

## envee

simple enviroment variables editor
with functions for :
- changing prompt ("envee prompt" for more details)
- adding/removing paths to/from PATH variable ("envee path help")
- adding/removing shortcuts to a directory ("envee shortcuts help")
- adding/removing hosts to quickly connect to ("envee hosts help")
- adding/removing alias'es ("envee custom help")
- modify what is displayed when shell is open ("envee welcome help")

# instalation

the project requires [deno](https://deno.com/) to work correctly

it is recomended to do it in home directory
```
#download repo
git clone https://github.com/LukIsHere/BreeMyBash ~/.bree
#go into directory
cd ~/.bree
#run instalation script
bash ./install.sh
#do not run that script twice till sb implements it better
```
after instalation all your data should be located inside ~/.bree/data

folder, modify manually at your own risk, if you mess up in best case

program won't work till fix, in worst case file will be completly wiped



# contributions
program will be improved/modified in order to fit my needs

PR with bug fixed, new functionalities and over all improvements welcome