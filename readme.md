# Some RPGmaker mv related tools

## plugins 

### `YyzManager.js`

Provide long text showing function. You can use pagedown ,pageup, space and ESC to control.
The text will automaticlly rearange `'\n'` and lines so you can only throw raw text into it.

```javascript
YyzManager.quickMessage(`The Gettysburg Address is a speech by U.S. President Abraham Lincoln. 
It was delivered on the afternoon of Thursday, November 19, 1863. This speech was made during 
the American Civil War, at the dedication of the Soldiers' National Cemetery in Gettysburg, 
Pennsylvania. This was four-and-a-half months after the Union Army had a victory over the 
Confederate States Army at the Battle of Gettysburg.

The address is one of the greatest speeches in the history of the United States. 
Lincoln spoke of how humans were equal as it has been said in the Declaration of Independence. 
He also said the Civil War was a fight not simply for the Union, but "a new birth of freedom" 
that would make everyone truly equal in one united nation.
`);
```


## Image processing tool

### `rmtool.py`

Commandline tool doing unpacking,packing, other transform on Sprites Sheet.
unpack:

`$ python rmtools.py unpack Actor2.png -x 4 -y 2 -o output`

batch unpack:

`$ python rmtools.py input_dir -d -o output_dir -x 12 -y 8`

pack:

`$ python rmtools.py pack output -o output2`