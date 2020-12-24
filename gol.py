import time
import sys

RED = "\033[1;31m"
END = "\033[0m"

ch = '#'
dim = 8

def count_neighbours(board, i, j):
    nc = 0
    neihbours = [
        (i, j - 1),
        (i, j + 1),
        (i - 1, j),
        (i - 1, j - 1),
        (i - 1, j + 1),
        (i + 1, j),
        (i + 1, j - 1),
        (i + 1, j + 1)
    ]
    for x, y in neihbours:
        if x < 0 or y < 0 or x >= dim or y >= dim:
            continue
        if board[x][y] == ch:
            nc += 1
    return nc


def grow_board(board):
    nb = []
    for i in range(dim):
        row = [' '] * dim
        nb.append(row)
    
    for i in range(dim):
        for j in range(dim):
            nc = count_neighbours(board, i, j)
            if board[i][j] == ch:
                if nc < 2 or nc > 3:
                    nb[i][j] = ' '
                else:
                    nb[i][j] = ch
            else:
                if nc == 3:
                    nb[i][j] = ch
                else:
                    nb[i][j] = ' '
    return nb

def print_board(board):
    for i in range(dim):
        print (' '.join(board[i]))

def erase_board(board):
    print ("$" * 50)
    return
    #print ('\r' * len(board))
    sys.stdout.write("\033[F" * dim)


board = [
    ['#'] * dim,
    ['#'] * dim,
    [' '] * dim,
    [' '] * dim,
    [' '] * dim,
    [' '] * dim,
    ['#'] * dim,
    ['#'] * dim
]
'''
board = []
for i in range(dim):
    row = [ch] * dim
    board.append(row)
'''

age = 10
print_board(board)
erase_board(board)
for i in range(age):
    board = grow_board(board)
    print_board(board)
    if i < (age - 1):
        erase_board(board)
    time.sleep(1)
