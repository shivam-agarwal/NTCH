
# coding: utf-8

# In[1]:


import pandas as pd


nodes = pd.read_csv("SampleFiles/InFiles/NodesAndGroups.csv")
nodes = nodes[['NodeName', 'NodeId']].copy()
edges = pd.read_csv("SampleFiles/InFiles/Edges-Names.csv")

node_n = dict(zip(nodes.NodeName, nodes.NodeId))

edge_duplicate = edges.copy()

edge_duplicate['Source'] = edge_duplicate['Source'].map(node_n) #replace(node_n)
edge_duplicate['Target'] = edge_duplicate['Target'].map(node_n)

edge_duplicate.to_csv("SampleFiles/OutFiles/layer1edges.csv", index=False)
edge_duplicate

