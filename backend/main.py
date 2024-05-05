from typing import Union
from fastapi import FastAPI
import uuid
from fastapi.middleware.cors import CORSMiddleware
from model import NodeV2, EdgesV2, GraphV2
from agent import get_topic_map

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}



@app.get("/generate/{topic}", response_model=GraphV2)
def generate(topic: str) -> GraphV2:
    node = NodeV2(name=topic, info="This is a topic")
    print("generating for topic", topic)
    output = get_topic_map(topic=topic)
    for node in output.nodes:
        edge = EdgesV2(source=topic, target=node.name, info="This is a relationship")
        output.edges.append(edge)
    output.nodes.append(node)
    print("-------------------edges-------------------")
    for edge in output.edges:
        print(edge)
    print("-------------------nodes--------------")
    for node in output.nodes:
        print(node)
    return output


@app.get("/add_to_node/{node_name}")
def add_to_node(node_name: str) -> GraphV2:
    print("generating for topic", node_name)
    output = get_topic_map(topic=node_name)
    for node in output.nodes:
        edge = EdgesV2(source=node_name, target=node.name, info="This is a relationship")
        output.edges.append(edge)

    print("-------------------edges-------------------")
    for edge in output.edges:
        print(edge)
    print("-------------------nodes--------------")
    for node in output.nodes:
        print(node)
    return output




