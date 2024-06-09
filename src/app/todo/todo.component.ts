import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent  implements OnInit{
  id: string | null = null;
  email: string | null = null;
  username: string | null = null;
  todoList: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (this.username) {
        this.fetchUserData(this.username);
      }
    });
  }  

  async fetchUserData(username: string) {
    try {
      const response = await axios.get(`https://back-end-finals.onrender.com/todo/${username}`);
      const { email, id  } = response.data;
      this.email = email;
      this.username = username;
      this.loadUserTodos(); // Call loadUserTodos here
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  async loadUserTodos() {
    try {
      if (this.username) {
        const response = await axios.get(`https://back-end-finals.onrender.com/todos/${this.username}`);
        this.todoList = response.data;
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  async pushItemToList() {
    const itemName = this.itemName.value;
    const user = this.username; 
    console.log(itemName);
    console.log(user);
    try {
      const response = await axios.post('https://back-end-finals.onrender.com/todo', { itemName, user });
      this.itemName.reset();
      this.user.setValue(this.username); 
      this.todoList.push(response.data); 
      console.log(response.data);
    } catch(error) {
      console.log('Error', error);
    }
  }
  
  itemName = new FormControl('', Validators.required);
  user = new FormControl({ value: '', disabled: true }, Validators.required);

  async loadTodoList() {
    try {
      const response = await axios.get('https://back-end-finals.onrender.com/todo');
      this.todoList = response.data;
    } catch(error) {
      console.log('Error loading todo list:', error);
    }
  }

  async updateUser(){
    const updatedEmail = prompt('Enter the updated email:', this.email ?? '');
    const updatedUsername = prompt('Enter the updated username:', this.username ?? '');

    if (!updatedEmail || !updatedUsername ) return; 

    try {
      const response = await axios.put(`https://back-end-finals.onrender.com//user/${this.id}`, { 
        email: updatedEmail, 
        username: updatedUsername,
      });
      this.email = response.data.email;
      this.username = response.data.username;
    } catch(error) {
      console.log('Error updating user:', error);
    }
  }
  async deleteUser(){
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`https://back-end-finals.onrender.com/user/${this.username}`);
      await axios.delete(`https://back-end-finals.onrender.com/todos/${this.username}`); 
    } catch(error) {
      console.log('Error deleting user:', error);
      this.router.navigate([`/login`]);
    }
  }
  async updateItem(item: any) {
    const updatedItemName = prompt('Enter the updated item name:', item.itemName);
    if (!updatedItemName) return; // If user cancels or inputs empty string, do nothing
  
    try {
      const response = await axios.put(`http://localhost:3000/update/${item.id}`, { itemName: updatedItemName });
      const updatedItemIndex = this.todoList.findIndex(todo => todo.id === item.id);
      if (updatedItemIndex !== -1) {
        this.todoList[updatedItemIndex].itemName = response.data.itemName; // Update the item name in the list with the response data
      }
    } catch(error) {
      console.log('Error updating item:', error);
    }
  }
  async deleteItem(itemId: any) {
    try {
      await axios.delete(`http://localhost:3000/todo/${itemId}`);
      // After successful deletion, remove the item from todoList
      this.todoList = this.todoList.filter(item => item.id !== itemId);
    } catch(error) {
      console.log('Error deleting item:', error);
    }
  }
}
