import subprocess

type = int(input("Type: "))

if type == 0:
    subprocess.run(["git", "add", "-A"])

    name = input("Name: ")

    subprocess.run(["git", "commit", "-m", name])
    subprocess.run(["git", "push"])
