# -*- coding: utf-8 -*-
"""
Created on Wed May 16 08:20:34 2018

@author: yiyuezhuo
"""

#import PIL
from PIL import Image
import os

def unpack(fpath, x=4, y=2, output_dir='unpack_output', png=True):
    # example.png
    # -> unpack('example.png',x=2,y=2) ->
    # unpack_output/example-0-0.png
    # unpack_output/example-0-1.png
    # unpack_output/example-1-0.png
    # unpack_output/example-1-1.png

    os.makedirs(output_dir, exist_ok=True)
    
    im = Image.open(fpath)
    xx,yy = im.size
    x_length = xx//x
    y_length = yy//y
    for i in range(x):
        for j in range(y):
            box = (i*x_length, j*y_length, (i+1)*x_length, (j+1)*y_length)
            sim = im.crop(box)
            name,ext = os.path.splitext(os.path.basename(fpath))
            if png:
                output_name = f'{name}-{i}-{j}.png'
            else:
                output_name = f'{name}-{i}-{j}{ext}'
            sim.save(os.path.join(output_dir, output_name))
    


def pack(dir_path,output_dir='pack_output',png=True):
    # This script will recognize "*-0-0.png" files and auto merge them.
    # dir_path/example-0-0.png
    # dir_path/example-0-1.png
    # dir_path/example-1-0.png
    # dir_path/example-1-1.png
    # -> pack('dir_path') ->
    # output_dir/example.png 
    os.makedirs(output_dir, exist_ok=True)
    
    firstname,ext = os.path.splitext(os.listdir(dir_path)[0])
    name = '-'.join(firstname.split('-')[:-2])
    x_list = []
    y_list = []
    for fname in os.listdir(dir_path):
        fname,ext = os.path.splitext(fname)
        sx,sy = fname.split('-')[-2:]
        x_list.append(int(sx))
        y_list.append(int(sy))
    x_size = max(x_list) + 1
    y_size = max(y_list) + 1
    i,j = 0,0
    firstimage = Image.open(os.path.join(dir_path,f'{name}-{i}-{j}{ext}'))
    x_length,y_length = firstimage.size
    output_image = Image.new('RGBA',(x_length*x_size,y_length*y_size))
    for i in range(x_size):
        for j in range(y_size):
            fpath = os.path.join(dir_path,f'{name}-{i}-{j}{ext}')
            im = Image.open(fpath)
            box = (i*x_length, j*y_length, (i+1)*x_length, (j+1)*y_length)
            output_image.paste(im,box=box)
    if png:
        output_image.save(os.path.join(output_dir,f'{name}.png'))
    else:
        output_image.save(os.path.join(output_dir,f'{name}{ext}'))
    


    
#im = Image.open('Actor2.png')