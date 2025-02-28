export const CODE_SAMPLES = [
  {
    language: "JavaScript",
    filename: "app.js",
    code: `
// Modern JavaScript application
import { useState, useEffect } from 'react';

// Simple Todo application
function TodoApp() {
const [todos, setTodos] = useState([]);
const [inputValue, setInputValue] = useState('');

// Load todos from localStorage on mount
useEffect(() => {
const savedTodos = localStorage.getItem('todos');
if (savedTodos) {
setTodos(JSON.parse(savedTodos));
}
}, []);

// Save todos to localStorage when they change
useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);

const handleSubmit = (e) => {
    e.preventDefault();
if (!inputValue.trim()) return;

const newTodo = {
    id: Date.now(),
    text: inputValue,
    completed: false
};

setTodos([...todos, newTodo]);
setInputValue('');
};

const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
};

const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
};

return (
<div className="todo-app">
  <h1>Todo List</h1>

  <form onSubmit={handleSubmit}>
    <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task"
    />
    <button type="submit">Add</button>
  </form>

  <ul className="todo-list">
      {todos.map(todo => (
      <li key={todo.id} className={todo.completed ? 'completed' : ''}>
        <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        />
        <span>{todo.text}</span>
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </li>
      ))}
  </ul>

  <div className="todo-count">
      {todos.filter(todo => !todo.completed).length} items left
  </div>
</div>
);
}`
  },
  {
    language: "Python",
    filename: "data_analysis.py",
    code: `
# Data analysis script in Python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Generate some sample data
np.random.seed(42)
n_samples = 1000

# Create customer data with 2 clear segments
segment1 = np.random.normal(loc=[5, 10], scale=[1, 1.5], size=(n_samples//2, 2))
segment2 = np.random.normal(loc=[15, 5], scale=[1.5, 1], size=(n_samples//2, 2))

data = np.vstack([segment1, segment2])
df = pd.DataFrame(data, columns=['purchase_frequency', 'avg_order_value'])

# Add some noise features
df['visit_count'] = np.random.normal(loc=10, scale=5, size=n_samples)
df['days_since_last_purchase'] = np.random.exponential(scale=30, size=n_samples)

# Scale the features
scaler = StandardScaler()
features = ['purchase_frequency', 'avg_order_value',
'visit_count', 'days_since_last_purchase']
X_scaled = scaler.fit_transform(df[features])

# Find optimal number of clusters using the elbow method
inertia = []
for k in range(1, 11):
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(X_scaled)
inertia.append(kmeans.inertia_)

# Plot the elbow curve
plt.figure(figsize=(10, 6))
plt.plot(range(1, 11), inertia, marker='o')
plt.title('Elbow Method for Optimal k')
plt.xlabel('Number of clusters')
plt.ylabel('Inertia')
plt.xticks(range(1, 11))
plt.grid(True, linestyle='--', alpha=0.7)

# Apply K-means with the optimal number of clusters (k=2 in this case)
kmeans = KMeans(n_clusters=2, random_state=42)
df['cluster'] = kmeans.fit_predict(X_scaled)

# Visualize the clusters
plt.figure(figsize=(12, 8))
plt.scatter(df['purchase_frequency'], df['avg_order_value'],
c=df['cluster'], cmap='viridis', alpha=0.8, s=50)

# Plot cluster centers
centers = scaler.inverse_transform(kmeans.cluster_centers_)[:, :2]
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.8, marker='X')

plt.title('Customer Segmentation')
plt.xlabel('Purchase Frequency')
plt.ylabel('Average Order Value')
plt.grid(True, linestyle='--', alpha=0.7)

# Calculate cluster statistics
cluster_stats = df.groupby('cluster').agg({
'purchase_frequency': ['mean', 'std'],
'avg_order_value': ['mean', 'std'],
'visit_count': ['mean', 'std'],
'days_since_last_purchase': ['mean', 'std']
})

print("Cluster Statistics:")
print(cluster_stats)

# Output recommendations based on segments
print("\nMarketing Recommendations:")
print("Segment 1: High-frequency, high-value customers")
print("  - Focus on retention and loyalty programs")
print("  - Offer premium products and services")

print("\nSegment 2: Low-frequency, low-value customers")
print("  - Focus on engagement and activation")
print("  - Offer incentives to increase purchase frequency")`
  },
  {
    language: "Rust",
    filename: "game_logic.rs",
    code: `
// Simple game logic in Rust
use std::collections::HashMap;
use std::fmt;
use rand::Rng;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
enum ItemType {
    Weapon,
    Armor,
    Potion,
    Scroll,
    Gem,
}

#[derive(Debug, Clone)]
struct Item {
    id: u32,
    name: String,
    item_type: ItemType,
    level: u32,
    value: u32,
    properties: HashMap<String, i32>,
}

impl Item {
    fn new(id: u32, name: &str, item_type: ItemType, level: u32) -> Self {
    let value = match item_type {
    ItemType::Weapon => level * 10,
    ItemType::Armor => level * 8,
    ItemType::Potion => level * 5,
    ItemType::Scroll => level * 15,
    ItemType::Gem => level * 25,
};

Item {
    id,
    name: name.to_string(),
    item_type,
    level,
    value,
    properties: HashMap::new(),
    }
}

fn add_property(&mut self, name: &str, value: i32) -> &mut Self {
    self.properties.insert(name.to_string(), value);
}`
  },
  {
    language: "C++",
    filename: "particle_system.cpp",
    code: `
// C++ Particle System Simulation
#include <iostream>
#include <vector>
#include <cmath>
#include <random>
#include <algorithm>
#include <chrono>
#include <thread>

struct Vector2 {
    float x, y;

    Vector2(float x = 0.0f, float y = 0.0f) : x(x), y(y) {}

    Vector2 operator+(const Vector2& v) const {
        return Vector2(x + v.x, y + v.y);
    }

    Vector2 operator-(const Vector2& v) const {
        return Vector2(x - v.x, y - v.y);
    }

    Vector2 operator*(float s) const {
        return Vector2(x * s, y * s);
    }

    float length() const {
        return std::sqrt(x*x + y*y);
    }

    Vector2 normalized() const {
        float len = length();
        if (len > 0.0001f) {
          return Vector2(x / len, y / len);
        }
        return *this;
    }
};

struct Color {
    float r, g, b, a;

    Color(float r = 1.0f, float g = 1.0f, float b = 1.0f, float a = 1.0f)
    : r(r), g(g), b(b), a(a) {}

    Color lerp(const Color& other, float t) const {
        return Color(
        r + (other.r - r) * t,
        g + (other.g - g) * t,
        b + (other.b - b) * t,
        a + (other.a - a) * t
        );
    }
}`
  },
  {
    language: "Go",
    filename: "server.go",
    code: `
// Simple web server in Go
package main

import (
"encoding/json"
"fmt"
"log"
"math/rand"
"net/http"
"strconv"
"sync"
"time"
)

// Task represents a to-do item
type Task struct {
ID        int       \`json:"id"\`
Title     string    \`json:"title"\`
Completed bool      \`json:"completed"\`
CreatedAt time.Time \`json:"created_at"\`
}

// TaskManager handles task operations
type TaskManager struct {
    tasks  map[int]Task
    nextID int
    mutex  sync.RWMutex
}

// NewTaskManager creates a new task manager
func NewTaskManager() *TaskManager {
    return &TaskManager{
        tasks:  make(map[int]Task),
        nextID: 1,
    }
}

// CreateTask adds a new task
func (tm *TaskManager) CreateTask(title string) Task {
    tm.mutex.Lock()
    defer tm.mutex.Unlock()

    task := Task{
        ID:        tm.nextID,
        Title:     title,
        Completed: false,
        CreatedAt: time.Now(),
    }

    tm.tasks[tm.nextID] = task
    tm.nextID++

    return task
}`
  },
  {
    language: "Swift",
    filename: "weather_app.swift",
    code: `
// Swift Weather App
import SwiftUI

// MARK: - Models

struct WeatherData: Identifiable, Codable {
    let id: UUID
    let city: String
    let temperature: Double
    let condition: WeatherCondition
    let humidity: Int
    let windSpeed: Double
    let date: Date

    init(city: String, temperature: Double, condition: WeatherCondition, humidity: Int, windSpeed: Double, date: Date = Date()) {
        self.id = UUID()
        self.city = city
        self.temperature = temperature
        self.condition = condition
        self.humidity = humidity
        self.windSpeed = windSpeed
        self.date = date
    }
}

enum WeatherCondition: String, Codable, CaseIterable {
    case sunny
    case cloudy
    case rainy
    case stormy
    case snowy

    var emoji: String {
        switch self {
            case .sunny: return "☀️"
            case .cloudy: return "☁️"
            case .rainy: return "🌧"
            case .stormy: return "⛈"
            case .snowy: return "❄️"
        }
    }

    var description: String {
        rawValue.capitalized
    }
}`
  }
];
