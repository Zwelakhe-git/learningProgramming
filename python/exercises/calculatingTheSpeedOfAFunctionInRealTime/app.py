import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
ax.set_xlim(0, 2 * np.pi)
ax.set_ylim(-1.5, 1.5)
ax.set_title("speed:")
(line,) = ax.plot([], [], label="main function")          # empty line to update
(speed,) = ax.plot([], [], label="gradient(speed)")
fig.legend()

speed_vals = []
N = 200
x = np.linspace(0, 2 * np.pi, N + 1)

for v in x:
    ax.axvline(x=v)

def gen():
    for v in x:
        yield v

def update(frame):
    expanded_x = x[:frame]
    expanded_y = np.sin(expanded_x)
    if frame > 1 and frame <= len(expanded_x):
        dx = expanded_x[1:frame] - expanded_x[:frame - 1]
        dy = expanded_y[1:frame] - expanded_y[:frame - 1]
        gradient = dy / dx

        #acceleration = (gradient[1:frame] - gradient[:frame - 1]) / dx
        speed.set_data(expanded_x[:frame - 1], gradient)
    line.set_data(expanded_x, expanded_y)
    return (line,speed)

ani = FuncAnimation(fig, update, frames=len(x), interval=30, blit=True)
plt.show()