const getCovertDataSource = (data: any) => {
  const names: any[] = [];
  const values: any[] = [];
  const seriesName: any[] = [];

  const dName = data
    ?.sort((a: any, b: any) => a.data_count - b.data_count)
    ?.map((item: any) => {
      seriesName.push(item.name);
    });

  values.push(["name", ...seriesName]);
  names.push({ code: "1", name: "тоо" });

  names.map(({ code, name }) => {
    const arr = [];
    arr.push(name);
    data
      .sort((a: any, b: any) => a.data_count - b.data_count)
      ?.map((item: any) => {
        seriesName.map((loc: any) => {
          if (loc === item.name) {
            arr.push(item.data_count);
          }
        });
      });
    values.push(arr);
  });

  return { names, values, seriesName };
};

const getCovertLineSource = (data: any) => {
  const names: any[] = [];
  const values: any[] = [];
  const seriesName: any[] = [];

  const dName = data
    ?.sort((a: any, b: any) => a.data_count - b.data_count)
    ?.map((item: any) => {
      seriesName.push(item.name);
    });

  values.push(["name", ...seriesName]);
  names.push({ code: "1", name: "тоо" });

  names.map(({ code, name }) => {
    const arr = [];
    arr.push(name);
    data
      .sort((a: any, b: any) => a.data_count - b.data_count)
      ?.map((item: any) => {
        seriesName.map((loc: any) => {
          if (loc === item.name) {
            arr.push(item.data_count);
          }
        });
      });
    values.push(arr);
  });

  // const records = data.map((item: any) => {
  //   for (const loc of location) {
  //     const arr = [];

  //     if (loc.id == item.db_name) {
  //       arr.push(loc.name);
  //       arr.push(item._count.id);
  //     }

  //     if (arr.length > 0) {
  //       values.push(arr);
  //     }
  //   }
  // });
  return { names, values, seriesName };
};

const getCovertDataPie = (data: any) => {
  const names: any[] = [];
  const values: any[] = [];
  const seriesName: any[] = [];

  names.push({ code: "1", name: "тоо" });
  const arr: any = [];
  data?.map((item: any) => {
    values.push({
      name: item.name,
      value: item.data_count,
    });
  });
  // values.push(arr);

  return { names, values, seriesName };
};

const getConvertTreeView = (data: any) => {
  const treeData = data.reduce((acc: any, item: any) => {
    // Find or create the database node
    let dbNode = acc.find((db: any) => db.name === item.name);
    if (!dbNode) {
      dbNode = {
        name: item.name,
        children: [],
        itemStyle: {
          color: "#1C45F4",
        },
        lineStyle: {
          color: "#408FC9",
        },
        label: {
          show: true,
          width: 80,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#408FC9",
          color: "#fff",
          padding: 5,
          fontSize: 9,
        },
      };
      acc.push(dbNode);
    }

    // Find or create the table node
    let tblNode = dbNode.children.find(
      (tbl: any) => tbl.name === item.tbl_name
    );
    if (!tblNode) {
      tblNode = {
        name: item.tbl_name,
        children: [],
        itemStyle: {
          color: "#1431AD",
        },
        lineStyle: {
          color: "#B9C5FC",
        },
        label: {
          show: true,
          width: 110,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#B9C5FC",
          color: "#000",
          padding: 5,
          fontSize: 9,
        },
      };
      dbNode.children.push(tblNode);
    }

    // Add the indicator node
    tblNode.children.push({
      name: item.indicator_name,
      itemStyle: {
        color: "#D79034",
      },
      lineStyle: {
        color: "#F2BE7A",
        width: 2,
        type: "dashed",
      },
      label: {
        show: true,
        width: 150,
        overflow: "breakAll",
        borderRadius: 5,
        backgroundColor: "#F2BE7A",
        color: "#000",
        padding: 5,
        fontSize: 9,
      },
    });

    return acc;
  }, []);
  // console.log({ treeData });

  return Object.values(treeData);
};

const getConvertDataHome = (data: any) => {
  const treeData = data.reduce((acc: any, item: any) => {
    let orgNode = acc.find((org: any) => org.name == item.org_name);
    if (!orgNode) {
      orgNode = {
        name: item.org_name,
        children: [],
        itemStyle: {
          color: "#6D9E41",
        },
        lineStyle: {
          color: "#A5C984",
        },
        label: {
          show: true,
          width: 150,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#A5C984",
          color: "#000",
          padding: 5,
          fontSize: 9,
        },
      };
      acc.push(orgNode);
    }

    // Find or create the database node
    let dbNode = orgNode.children.find((db: any) => db.name === item.db_name);
    if (!dbNode) {
      dbNode = {
        name: item.db_name,
        children: [],
        itemStyle: {
          color: "#1C45F4",
        },
        lineStyle: {
          color: "#408FC9",
          width: 2,
          type: "solid",
        },
        label: {
          show: true,
          width: 80,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#408FC9",
          color: "#fff",
          padding: 5,
          fontSize: 9,
        },
      };
      orgNode.children.push(dbNode);
    }

    // Find or create the table node
    let tblNode = dbNode.children.find((tbl: any) => tbl.name == item.tbl_name);
    if (!tblNode) {
      tblNode = {
        name: item.tbl_name,
        children: [],
        itemStyle: {
          color: "#1C45F4",
        },
        lineStyle: {
          color: "#B9C5FC",
          width: 2,
          type: "solid",
        },
        label: {
          show: true,
          width: 80,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#B9C5FC",
          color: "#000",
          padding: 5,
          fontSize: 9,
        },
      };
      dbNode.children.push(tblNode);
    }

    // Add the indicator node
    tblNode.children.push({
      name: item.indicator_name,
      itemStyle: {
        color: "#D79034",
      },
      lineStyle: {
        color: "#F2BE7A",
        width: 2,
        type: "solid",
      },
      label: {
        show: true,
        width: 150,
        overflow: "breakAll",
        borderRadius: 5,
        backgroundColor: "#F2BE7A",
        color: "#000",
        padding: 5,
        fontSize: 9,
      },
    });

    return acc;
  }, []);

  return Object.values(treeData);
};
const getConvertSearchData = (indicator: any, allOrg: any, levelID: any) => {
  let allOrgData;
  if (levelID == 1) {
    allOrgData = indicator?.reduce((acc: any, dt: any) => {
      const indicatorName = dt._source?.indicator_name;
      const tblName = dt._source?.tbl_name;
      const dbName = dt._source?.db_name;
      const orgName = allOrg.find(
        (org: any) => org.db_id === dt._source?.db_id
      )?.org_name;

      if (!acc.find((indicator: any) => indicator.name === indicatorName)) {
        acc.push({
          name: indicatorName,
          children: [
            {
              name: tblName,
              children: [
                {
                  name: dbName,
                  children: [
                    {
                      name: orgName,
                      itemStyle: {
                        color: "#6D9E41",
                      },
                      lineStyle: {
                        color: "#A5C984",
                      },
                      label: {
                        show: true,
                        width: 150,
                        overflow: "breakAll",
                        borderRadius: 5,
                        backgroundColor: "#A5C984",
                        color: "#000",
                        padding: 5,
                        fontSize: 9,
                      },
                    },
                  ],
                  itemStyle: {
                    color: "#1C45F4",
                  },
                  lineStyle: {
                    color: "#408FC9",
                  },
                  label: {
                    show: true,
                    width: 100,
                    overflow: "breakAll",
                    borderRadius: 5,
                    backgroundColor: "#408FC9",
                    color: "#fff",
                    padding: 5,
                    fontSize: 9,
                  },
                },
              ],
              itemStyle: {
                color: "#1431AD",
              },
              lineStyle: {
                color: "#B9C5FC",
              },
              label: {
                show: true,
                width: 110,
                overflow: "breakAll",
                borderRadius: 5,
                backgroundColor: "#B9C5FC",
                color: "#000",
                padding: 5,
                fontSize: 9,
              },
            },
          ],
          itemStyle: {
            color: "#D79034",
          },
          lineStyle: {
            color: "#F2BE7A",
            width: 2,
            type: "solid",
          },
          label: {
            show: true,
            width: 100,
            overflow: "breakAll",
            borderRadius: 5,
            backgroundColor: "#F2BE7A",
            color: "#000",
            padding: 5,
            fontSize: 9,
          },
        });
      } else {
        const indicator = acc.find(
          (indicator: any) => indicator.name === indicatorName
        );
        if (!indicator.children.find((tbl: any) => tbl.name === tblName)) {
          indicator.children.push({
            name: tblName,
            children: [
              {
                name: dbName,
                children: [
                  {
                    name: orgName,
                    itemStyle: {
                      color: "#6D9E41",
                    },
                    lineStyle: {
                      color: "#A5C984",
                    },
                    label: {
                      show: true,
                      width: 150,
                      overflow: "breakAll",
                      borderRadius: 5,
                      backgroundColor: "#A5C984",
                      color: "#000",
                      padding: 5,
                      fontSize: 9,
                    },
                  },
                ],
                itemStyle: {
                  color: "#1C45F4",
                },
                lineStyle: {
                  color: "#408FC9",
                },
                label: {
                  show: true,
                  width: 100,
                  overflow: "breakAll",
                  borderRadius: 5,
                  backgroundColor: "#408FC9",
                  color: "#fff",
                  padding: 5,
                  fontSize: 9,
                },
              },
            ],
            itemStyle: {
              color: "#1431AD",
            },
            lineStyle: {
              color: "#B9C5FC",
            },
            label: {
              show: true,
              width: 110,
              overflow: "breakAll",
              borderRadius: 5,
              backgroundColor: "#B9C5FC",
              color: "#000",
              padding: 5,
              fontSize: 9,
            },
          });
        } else {
          const tbl = indicator.children.find(
            (tbl: any) => tbl.name === tblName
          );
          if (!tbl.children.find((db: any) => db.name === dbName)) {
            tbl.children.push({
              name: dbName,
              children: [
                {
                  name: orgName,
                  itemStyle: {
                    color: "#6D9E41",
                  },
                  lineStyle: {
                    color: "#A5C984",
                  },
                  label: {
                    show: true,
                    width: 150,
                    overflow: "breakAll",
                    borderRadius: 5,
                    backgroundColor: "#A5C984",
                    color: "#000",
                    padding: 5,
                    fontSize: 9,
                  },
                },
              ],
            });
          } else {
            const db = tbl.children.find((db: any) => db.name === dbName);
            if (!db.children.find((org: any) => org.name === orgName)) {
              db.children.push({
                name: orgName,
                itemStyle: {
                  color: "#6D9E41",
                },
                lineStyle: {
                  color: "#A5C984",
                },
                label: {
                  show: true,
                  width: 150,
                  overflow: "breakAll",
                  borderRadius: 5,
                  backgroundColor: "#A5C984",
                  color: "#000",
                  padding: 5,
                  fontSize: 9,
                },
              });
            }
          }
        }
      }

      return acc;
    }, []);
  } else {
    allOrgData = indicator
      ?.filter((dt: any) => dt._source?.db_id == allOrg[0].db_id)
      ?.reduce((acc: any, dt: any) => {
        const indicatorName = dt._source?.indicator_name;
        const tblName = dt._source?.tbl_name;
        const dbName = dt._source?.db_name;
        const orgName = allOrg.find(
          (org: any) => org.db_id === dt._source?.db_id
        )?.org_name;

        if (!acc.find((indicator: any) => indicator.name === indicatorName)) {
          acc.push({
            name: indicatorName,
            children: [
              {
                name: tblName,
                children: [
                  {
                    name: dbName,
                    children: [
                      {
                        name: orgName,
                        itemStyle: {
                          color: "#6D9E41",
                        },
                        lineStyle: {
                          color: "#A5C984",
                        },
                        label: {
                          show: true,
                          width: 150,
                          overflow: "breakAll",
                          borderRadius: 5,
                          backgroundColor: "#A5C984",
                          color: "#000",
                          padding: 5,
                          fontSize: 9,
                        },
                      },
                    ],
                    itemStyle: {
                      color: "#1C45F4",
                    },
                    lineStyle: {
                      color: "#408FC9",
                    },
                    label: {
                      show: true,
                      width: 100,
                      overflow: "breakAll",
                      borderRadius: 5,
                      backgroundColor: "#408FC9",
                      color: "#fff",
                      padding: 5,
                      fontSize: 9,
                    },
                  },
                ],
                itemStyle: {
                  color: "#1431AD",
                },
                lineStyle: {
                  color: "#B9C5FC",
                },
                label: {
                  show: true,
                  width: 110,
                  overflow: "breakAll",
                  borderRadius: 5,
                  backgroundColor: "#B9C5FC",
                  color: "#000",
                  padding: 5,
                  fontSize: 9,
                },
              },
            ],
            itemStyle: {
              color: "#D79034",
            },
            lineStyle: {
              color: "#F2BE7A",
              width: 2,
              type: "solid",
            },
            label: {
              show: true,
              width: 100,
              overflow: "breakAll",
              borderRadius: 5,
              backgroundColor: "#F2BE7A",
              color: "#000",
              padding: 5,
              fontSize: 9,
            },
          });
        } else {
          const indicator = acc.find(
            (indicator: any) => indicator.name === indicatorName
          );
          if (!indicator.children.find((tbl: any) => tbl.name === tblName)) {
            indicator.children.push({
              name: tblName,
              children: [
                {
                  name: dbName,
                  children: [
                    {
                      name: orgName,
                      itemStyle: {
                        color: "#6D9E41",
                      },
                      lineStyle: {
                        color: "#A5C984",
                      },
                      label: {
                        show: true,
                        width: 150,
                        overflow: "breakAll",
                        borderRadius: 5,
                        backgroundColor: "#A5C984",
                        color: "#000",
                        padding: 5,
                        fontSize: 9,
                      },
                    },
                  ],
                  itemStyle: {
                    color: "#1C45F4",
                  },
                  lineStyle: {
                    color: "#408FC9",
                  },
                  label: {
                    show: true,
                    width: 100,
                    overflow: "breakAll",
                    borderRadius: 5,
                    backgroundColor: "#408FC9",
                    color: "#fff",
                    padding: 5,
                    fontSize: 9,
                  },
                },
              ],
              itemStyle: {
                color: "#1431AD",
              },
              lineStyle: {
                color: "#B9C5FC",
              },
              label: {
                show: true,
                width: 110,
                overflow: "breakAll",
                borderRadius: 5,
                backgroundColor: "#B9C5FC",
                color: "#000",
                padding: 5,
                fontSize: 9,
              },
            });
          } else {
            const tbl = indicator.children.find(
              (tbl: any) => tbl.name === tblName
            );
            if (!tbl.children.find((db: any) => db.name === dbName)) {
              tbl.children.push({
                name: dbName,
                children: [
                  {
                    name: orgName,
                    itemStyle: {
                      color: "#6D9E41",
                    },
                    lineStyle: {
                      color: "#A5C984",
                    },
                    label: {
                      show: true,
                      width: 150,
                      overflow: "breakAll",
                      borderRadius: 5,
                      backgroundColor: "#A5C984",
                      color: "#000",
                      padding: 5,
                      fontSize: 9,
                    },
                  },
                ],
              });
            } else {
              const db = tbl.children.find((db: any) => db.name === dbName);
              if (!db.children.find((org: any) => org.name === orgName)) {
                db.children.push({
                  name: orgName,
                  itemStyle: {
                    color: "#6D9E41",
                  },
                  lineStyle: {
                    color: "#A5C984",
                  },
                  label: {
                    show: true,
                    width: 150,
                    overflow: "breakAll",
                    borderRadius: 5,
                    backgroundColor: "#A5C984",
                    color: "#000",
                    padding: 5,
                    fontSize: 9,
                  },
                });
              }
            }
          }
        }

        return acc;
      }, []);
  }

  return allOrgData;
};
export {
  getCovertDataSource,
  getCovertDataPie,
  getConvertTreeView,
  getCovertLineSource,
  getConvertDataHome,
  getConvertSearchData,
};
