# -*- coding: utf-8 -*-
"""
Created on Wed May 16 13:06:44 2018

@author: yiyuezhuo
"""

from PIL import Image
import numpy as np


#im = Image.open("H.png")

def convert_color_to_alpha(im, color=(0,0,0,255)):
    x,y = im.size
    xy_list = []
    for i in range(x):
        for j in range(y):
            if im.getpixel((i,j)) != color:
                continue
            if i >0 and i < x-1 and j>0 and j <y-1:
                if im.getpixel((i-1,j)) != color or im.getpixel((i+1,j)) != color or \
                    im.getpixel((i,j-1)) != color or im.getpixel((i,j+1)) != color:
                        continue
            #im.putpixel((i,j),(0,0,0,0))
            xy_list.append((i,j))
    for xy in xy_list:
        im.putpixel(xy,(0,0,0,0))
    return im
    
def convert_color_to_alpha_tol(im, color=(255,255,255),tol=10.0):
    #x,y = im.size
    ij_list = []
    
    array_im = np.array(im)
    arr = (np.abs(array_im[:,:,:3] - np.array(color))).astype(float).sum(-1)
    
    for i in range(arr.shape[0]):
        for j in range(arr.shape[1]):
            if arr[i,j] > tol:
                continue
            if i >0 and i < arr.shape[0]-1 and j>0 and j <arr.shape[1]-1:
                if arr[i-1,j] > tol or arr[i+1,j] > tol or \
                    arr[i,j-1] > tol or arr[i,j+1] > tol:
                        continue
            #im.putpixel((i,j),(0,0,0,0))
            ij_list.append((i,j))
    for i,j in ij_list:
        array_im[i,j] = (255,255,255,0)
        #im.putpixel(xy,(255,255,255,0))
    return Image.fromarray(array_im,mode='RGBA')

def convert_mask_to_alpha(im, mask, inverse=True):
    #import numpy as np
    if inverse:
        mask = Image.fromarray(~np.array(mask))
    new_im = Image.new('RGBA',im.size,(0,0,0,0))
    new_im.paste(im, mask=mask.convert('L'))
    return new_im

def convert_alpha_to_color_exact(im, color=(128,128,128,255)):
    #import numpy as np
    arr=np.array(im)
    mask=arr[:,:,3] == 0
    for chanel in range(4):
        arr[mask,chanel] = color[chanel]
    return Image.fromarray(arr)

def convert_color_to_alpha_exact(im, color=(128,128,128,255)):
    arr = np.array(im)
    mask = (arr == np.array(color)).all(axis=2)
    #arr[mask] = np.array([0,0,0,0])
    alpha_color = (0,0,0,0)
    for c in range(len(color)):
        arr[mask,c] = alpha_color[c]
    return Image.fromarray(arr)

'''
DEBUG=False

if __name__ == '__main__' and not DEBUG:
    import argparse
    parser = argparse.ArgumentParser(description='convert specified color to alpha')
    parser.add_argument('path', help="image path")
    parser.add_argument('-b','--backup', dest='is_backup', action='store_const',
                        const=False, default=True, help='Whether not to backup')
    args = parser.parse_args()
    
    if args.is_backup:
        import shutil
        shutil.copy(args.path, f'{args.path}.bak')
    im = Image.open(args.path)
    convert_color_to_alpha(im).save(args.path)
    
if DEBUG:
    for i in range(1,29):
        im_name = f'output9/ayako{i:0>2}-0-0.png'
        mask_name = f'output9/ayako{i:0>2}-1-0.png'
        im = Image.open(im_name)
        mask = Image.open(mask_name)
        res_im = convert_mask_to_alpha(im, mask)
        res_im.save(f'output10/ayako{i:0>2}.png')
'''