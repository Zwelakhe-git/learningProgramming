import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 5)
ax.set_aspect("equal")
ax.axhline(0, color="grey", lw=0.5)
ax.axvline(0, color="grey", lw=0.5)

ax.grid(True, alpha=0.3)
def f(x):
    return np.sin(x)

def g(x, theta):
    y = f(x)
    x2 = x*np.cos(theta) - y*np.sin(theta)
    y2 = x*np.sin(theta) + y*np.cos(theta)

    return [x2, y2]

(line,) = ax.plot([], [])          # empty line to update

x = np.linspace(-np.pi , np.pi, 200)

n = 180
def update(frame):
    theta = 2 * np.pi * frame / n
    data = g(x, theta)
    line.set_data(data[:][0], data[:][1])
    return (line,)


ani = FuncAnimation(fig, update, frames=n, interval=30, blit=True)
plt.show()