# -*- coding: utf-8 -*-
"""
Created on Mon Aug 27 15:44:04 2018

@author: yiyuezhuo
"""

from shutil import copyfile


import argparse
parser = argparse.ArgumentParser(description='flatten tool')
parser.add_argument('src_dir')
parser.add_argument('dst_dir')
args = parser.parse_args()

import os
os.makedirs(args.dst_dir, exist_ok = True)
for root, dirs, files in os.walk(args.src_dir):
    for name in files:
        src_path = os.path.join(root, name)
        dst_path = os.path.join(args.dst_dir, name)
        copyfile(src_path, dst_path)
        print(f'copy: {src_path} -> {dst_path}')