### vim编辑器命令  
#### 一.输入和保存  
1.vim 进入 vim编辑器之后会进入 normal 模式,此时无法输入  
六个命令进入 insert 模式,可输入,按esc可退回 normal 模式  
- i (insert) 在当前光标的前面插入; I (大写的i) 在当前行前面插入.    
- a (append) 在当前光标的后面插入; A (大写的a) 在当前行后面插入.
- o (open a line below) 在当前光标的下一行插入;O (大写的o) 在当前行上一行插入,会把当前行挤下去.  

2.保存并退出  
首先按 esc 退回 normal模式  
- :w (writen) 保存  
- :q (quit) 退出
- :wq 组合,保存并退出 
