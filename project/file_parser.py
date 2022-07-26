import pandas as pd
import numpy as np
import json


def parse_excel_sheet(file, sheet_name=0, threshold=6):
    '''parses multiple tables from an excel sheet into multiple data frame objects. Returns [dfs, df_mds], where dfs is a list of data frames and df_mds their potential associated metadata'''
    xl = pd.ExcelFile(file)
    entire_sheet = xl.parse(sheet_name=sheet_name)

    # count the number of non-Nan cells in each row and then the change in that number between adjacent rows
    n_values = np.logical_not(entire_sheet.isnull()).sum(axis=1)
    n_values_deltas = n_values[1:] - n_values[:-1].values

    # define the beginnings and ends of tables using delta in n_values
    table_beginnings = n_values_deltas > threshold
    table_beginnings = table_beginnings[table_beginnings].index
    table_endings = n_values_deltas < -threshold
    table_endings = table_endings[table_endings].index
    if len(table_beginnings) < len(table_endings) or len(table_beginnings) > len(table_endings)+1:
        raise BaseException(
            'Could not detect equal number of beginnings and ends')

    # make data frames
    dfs = []
    for ind in range(len(table_beginnings)):
        start = table_beginnings[ind]+1
        if ind < len(table_endings):
            stop = table_endings[ind]
        else:
            stop = entire_sheet.shape[0]
        df = xl.parse(sheet_name=sheet_name, skiprows=start, nrows=stop-start)
        dfs.append(df.drop([0], axis=0))
    return pd.concat(dfs, axis=0).reset_index(drop=True)


def read_json_file(file):
    f = open(file)
    return json.load(f)

def convert_df(df, json):
    df_m = pd.DataFrame()
    for key, value in json.items():
        new_col, old_col, default_value = key, value['col_name'], value['default_value']
        if old_col == '':
            print(f"new column: {new_col}, old column: {old_col}")
            df_m[new_col] = default_value
        else:
            print(f"new column: {new_col}, old column: {old_col}")
            df_m[new_col] = df[old_col]

    df_m = df_m.replace({"": np.nan})
    df_m.to_excel("./result.xlsx")



def convert_format(sheet_file, json_file):
    df = parse_excel_sheet(sheet_file)
    json = read_json_file(json_file)
    convert_df(df, json)
    print("done!")

    