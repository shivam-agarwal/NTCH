
# coding: utf-8

# In[ ]:


import pandas as pd
import os
import itertools
import csv

edges = pd.read_csv("SampleFiles/InFiles/Edges-Names.csv")
nodes = pd.read_csv("SampleFiles/InFiles/NodesAndGroups.csv")

edges_list = edges.values.tolist()

with open(r'SampleFiles/OutFiles/AdjacencyMatrices.csv', 'a') as f:
    writer = csv.writer(f)
    count = 0
    for groupnumber, group in nodes.groupby('GroupNumber'):
        print count
        nodeNames = list(group.NodeName) 
        nodeId = list(group.NodeId)
        mapping_name_id = zip(nodeNames, nodeId)
        mapping_name_id = list(itertools.chain(*mapping_name_id))
        writer.writerow([len(nodeNames), len(nodeNames)])
        writer.writerow(mapping_name_id)
        writer.writerow(mapping_name_id)
        p = pd.DataFrame(columns=nodeNames, index=nodeNames)
        for j in range(0, len(edges_list)):
            if (edges_list[j][0] in nodeNames) and (edges_list[j][1] in nodeNames):
                p.at[edges_list[j][0], edges_list[j][1]] = edges_list[j][2]
                p.at[edges_list[j][1], edges_list[j][0]] = edges_list[j][2]
        p = p.fillna(0)
        p = p.as_matrix()
        for i in range(0, len(p)):
            writer.writerow(p[i])
        count += 1
    f.close()

