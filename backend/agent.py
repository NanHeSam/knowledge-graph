import json
from langchain.agents import initialize_agent, Tool
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain.tools import tool
from model import Graph, Node, Edges, GraphV2, NodeV2, EdgesV2
from typing import Literal
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
load_dotenv()
import json

SYSTEM_MESSAGE = """You are a knowledge graph system. You are given a topic and a knowledge graph. 
                You need to update the knowledge graph with the new around 3 topic and some edges. 
                Make sure the edges are between the node you generated and the existing nodes in the graph. 
                Make sure to use short name for the nodes and make sure to generate some edges.
                You can use the convert_to_graph tool to convert the nodes and edges to a graph object."""

@tool(args_schema=Graph)
def convert_to_graph(nodes: list[Node], edges: list[Edges]) -> Graph:
    """
    convert the list of nodes and edges to a graph object

    """
    return Graph(nodes=nodes, edges=edges)

def get_topic_map(topic):

    prompt = ChatPromptTemplate.from_messages([
        ("system",SYSTEM_MESSAGE),
        ("user", "can you help me generate some exploration topics for {topic}?")
    ])
    chain1 = prompt | ChatOpenAI(temperature=0.7, streaming=True)
    topics_graph = chain1.invoke({"topic": topic, "conversation": []})
    prompt2 = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_MESSAGE),
        ("user", "can you help me generate some exploration topics for {topic}?"),
        ("ai", topics_graph.content),
        ("user", "can you help me convert it to fit the graph class format?"),
    ])
    chain2 = prompt2 | ChatOpenAI(temperature=0, streaming=True).bind_tools([convert_to_graph])
    result = chain2.invoke({"topic": topic})

    call_args = json.loads(result.additional_kwargs['tool_calls'][0]['function']['arguments'])
    nodes = call_args['nodes']
    edges = call_args['edges']
    node_list = []
    edge_list = []
    for node in nodes:
        node_list.append(NodeV2(name=node.get('name', ''), info=node.get('info', '')))
    for edge in edges:
        edge_list.append(EdgesV2(source=edge.get('source',''), target=edge.get('target',''), info=edge.get('info', '')))
    graph = GraphV2(nodes=node_list, edges=edge_list)
    return graph




# if __name__ == "__main__":
#     get_topic_map("python")
