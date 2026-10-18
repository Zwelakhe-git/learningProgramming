from tasks import send_message

class App():

    def run(self):
        send_message.delay("234", "Did you finally practice using celery? Alway be specific.")

if __name__ == "__main__":
    app = App()
    app.run()
