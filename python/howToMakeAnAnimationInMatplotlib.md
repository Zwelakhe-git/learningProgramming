

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
ax.set_xlim(0, 2 * np.pi)
ax.set_ylim(-1.5, 1.5)

(line,) = ax.plot([], [])          # empty line to update

x = np.linspace(0, 2 * np.pi, 200)

def update(frame):
    line.set_data(x[:frame], np.sin(x[:frame]))
    return (line,)

ani = FuncAnimation(fig, update, frames=len(x), interval=30, blit=True)
plt.show()
```

its important to note what we animate. we can animate the drawing of the graph. so that means at each frame we add new points to the line, keeping the existing ones. so in a way we are running append on the list of the data in the line. every 'interval' ms a new frame is drawn and the `update` is called.