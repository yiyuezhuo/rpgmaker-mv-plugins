# -*- coding: utf-8 -*-
"""
Created on Thu May 17 09:10:59 2018

@author: yiyuezhuo
"""

from sheet_unpack import unpack,pack
from convert_alpha import convert_color_to_alpha,convert_alpha_to_color_exact,\
    convert_color_to_alpha_exact

from PIL import Image
import os

def batch_process_path(transform, path, output_dir, ext=None, flatten=False):
    im = Image.open(path)
    im = transform(im)
    root,fullname = os.path.split(path)
    name,_ext = os.path.splitext(fullname)
    if ext is None:
        ext = _ext
    output_name = f'{name}{ext}'
    if root=='' or os.sep not in root or flatten:
        output_root = output_dir
    else:
        output_root = root.replace(root.split(os.sep)[0], output_dir, 1)
    os.makedirs(output_root, exist_ok=True)
    im.save(os.path.join(output_root, output_name))
    
def batch_process_paths(transform, paths, *args, **kwargs):
    for path in paths:
        batch_process_path(transform, path, *args, **kwargs)
        
def batch_process(_transform, args):
    kwargs = {}
    
    # process color
    if args.color is not None:
        kwargs['color'] = tuple(args.color)
        
    if args.mode is None:
        transform = lambda im:_transform(im, **kwargs)
    else:
        transform = lambda im:_transform(im.convert(args.mode), **kwargs)
    batch_process_paths(transform, args.path, output_dir = args.output, 
                        ext='.png' if args.png else None, flatten = args.flatten)  


import argparse

parser = argparse.ArgumentParser(description='RPG maker mv image processing tool')
parser.add_argument('command', help='pack, unpack, filter_convert, alpha_to_color, color_to_alpha, to_png')
parser.add_argument('path', nargs='+', help="sub images directory for pack or single image path for unpack")
parser.add_argument('-o','--output', help='output that store results of pack or unpack',default='output')
parser.add_argument('-x','--x', help='unpack arg', type=int, default=4)
parser.add_argument('-y','--y', help='unpack arg', type=int, default=2)
parser.add_argument('-p','--png', help='force output png', action='store_const', const=True, default=False)
parser.add_argument('-c','--color',default=None,type=int,nargs='+',help='specified color. Example: -c 0 0 0 255')
parser.add_argument('-d','--directory',action='store_const',const=True, default=False, help="See path as directory and expand it.")
parser.add_argument('-f','--flatten',action='store_const',const=True,default=False,help='output all file in top output directory.(Maybe raise same name error)')
parser.add_argument('-s','--second',help="Seconds to be contributed to The Elder.")
parser.add_argument('-m','--mode',help="Image will be converted to the mode(i.e. 'RGB','RGBA') before process")
args = parser.parse_args()

if args.directory:
    dir_paths = args.path
    paths = []
    for _dir in dir_paths:
        for dirpath, dirnames, filenames in os.walk(_dir):
            for filename in filenames:
                # dirnames is name of dir in dirpath, but the subfile in there will
                # be walked lately so we don't use it there.
                paths.append(os.path.join(dirpath, filename))
    args.path = paths

if args.command == 'unpack':
    for path in args.path:
        unpack(path, x=args.x, y=args.y, output_dir = args.output, png=args.png)
elif args.command == 'pack':
    for path in args.path:
        pack(path, output_dir=args.output, png=args.png)
elif args.command == 'filter_convert':
    batch_process(convert_color_to_alpha, args)
elif args.command == 'alpha_to_color':
    batch_process(convert_alpha_to_color_exact, args)
elif args.command == 'color_to_alpha':
    batch_process(convert_color_to_alpha_exact, args)
elif args.command == 'to_png':
    args.png = True
    batch_process(lambda im:im, args)
else:
    print(f"Unrecognized command {args.command}")
