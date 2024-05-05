from pydantic.v1 import BaseModel, Field
from pydantic import BaseModel as BaseModelV2, Field as FieldV2
import uuid

class Edges(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: str
    target: str
    info: str

class Node(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    info: str

class Graph(BaseModel):
    nodes: list[Node]
    edges: list[Edges]
    

class EdgesV2(BaseModelV2):
    id: str = FieldV2(default_factory=lambda: str(uuid.uuid4()))
    source: str
    target: str
    info: str

class NodeV2(BaseModelV2):
    id: str = FieldV2(default_factory=lambda: str(uuid.uuid4()))
    name: str
    info: str

class GraphV2(BaseModelV2):
    nodes: list[NodeV2]
    edges: list[EdgesV2]
    

